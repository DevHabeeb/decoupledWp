import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Heading, Indent, IndentBlock, Italic, Link, List, MediaEmbed, Paragraph, Table, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useState, useEffect } from 'react';

const EditPostModal = ({ handleCloseEvent, postId, categoriesList, fetchWordPressPosts }) => {
  const defaultFeaturedImage = "https://idl-3d.xyz/wp-content/uploads/2026/02/Contact-Image.webp";
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredMediaId, setFeaturedMediaId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchSingleWordPressPostData(postId);
  }, [postId]);

  const fetchSingleWordPressPostData = async (postId) => {
    const fetchWordPressPostMediaURL = async (mediaID) => {
      try {
        const apiResponse = await fetch(`https://idl-3d.xyz/wp-json/wp/v2/media/${mediaID}`, {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("DevHabeeb:PcIr TSS6 gqSD Mcof FUIT Mim7")
          }
        });
        const apiData = await apiResponse.json();
        setFeaturedImagePreview(apiData.source_url || defaultFeaturedImage);
      } catch (error) {
        console.error("Error fetching WordPress post media URL:", error);
        setFeaturedImagePreview(defaultFeaturedImage);
      }
    };

    try {
      const apiResponse = await fetch(`https://idl-3d.xyz/wp-json/wp/v2/posts/${postId}`, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("DevHabeeb:NIL")
        }
      });

      const apiData = await apiResponse.json();
      setTitle(apiData.title.rendered || "");
      setCategory(apiData.categories?.[0] || "");
      setEditorContent(apiData.content.rendered || "");
      setStatus(apiData.status || "draft");
      setFeaturedMediaId(apiData.featured_media || null);

      if (apiData.featured_media) {
        fetchWordPressPostMediaURL(apiData.featured_media);
      } else {
        setFeaturedImagePreview(defaultFeaturedImage);
      }
    } catch (error) {
      console.error("Error fetching single WordPress post data:", error);
    }
  };

  const handleFormSubmitData = async (e) => {
    e.preventDefault();

    let updatedFeaturedMediaId = featuredMediaId;

    if (featuredImageFile) {
      updatedFeaturedMediaId = await uploadNewFeaturedImage(featuredImageFile);
    }

    const postData = {
      title,
      categories: [category],
      content: editorContent,
      featured_media: updatedFeaturedMediaId,
      status
    };

    try {
      const apiResponse = await fetch(`https://idl-3d.xyz/wp-json/wp/v2/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("DevHabeeb:NIL")
        },
        body: JSON.stringify(postData)
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        console.error("Full error response:", errorData);
        throw new Error(errorData.message || "Failed to update post");
      }

      handleCloseEvent();
      fetchWordPressPosts?.();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const uploadNewFeaturedImage = async (featuredImageFileToUpload) => {
    try {
      const formData = new FormData();
      formData.append("file", featuredImageFileToUpload, featuredImageFileToUpload.name);
      formData.append("alt_text", "Featured Image of Post");

      const apiResponse = await fetch("https://idl-3d.xyz/wp-json/wp/v2/media", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa("DevHabeeb:NIL")
        },
        body: formData
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        console.error("Full media upload error:", errorData);
        throw new Error(errorData.message || "Failed to upload featured image");
      }

      const apiData = await apiResponse.json();
      return apiData.id;
    } catch (error) {
      console.error("Error uploading new featured image:", error);
      return featuredMediaId;
    }
  };

  return (
    <>
      <div className="modal" id="editPostModal">
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/25" onClick={handleCloseEvent}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative" onClick={(e) => e.stopPropagation()}>
            <div className="loader"></div>
            <h2 className="text-2xl mb-4">Edit Post</h2>
            <form onSubmit={handleFormSubmitData}>
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded w-full p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    className="border border-gray-300 rounded w-full p-2"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {Object.entries(categoriesList).map(([index, value]) => (
                      <option key={index} value={index}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorContent}
                  config={{
                    licenseKey: 'GPL',
                    toolbar: [
                      'undo', 'redo', '|',
                      'heading', '|', 'bold', 'italic', '|',
                      'link', 'insertTable', 'mediaEmbed', '|',
                      'bulletedList', 'numberedList', 'indent', 'outdent'
                    ],
                    plugins: [
                      Bold,
                      Essentials,
                      Heading,
                      Indent,
                      IndentBlock,
                      Italic,
                      Link,
                      List,
                      MediaEmbed,
                      Paragraph,
                      Table,
                      Undo
                    ],
                    initialData: '<h1>Hello from CKEditor 5!</h1>'
                  }}
                  onChange={(e, editor) => {
                    const editorData = editor.getData();
                    setEditorContent(editorData);
                  }}
                />
              </div>

              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Featured Image</label>
                  <input
                    className="p-4 border border-gray-300 bg-gray-100 cursor-pointer rounded"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setFeaturedImageFile(selectedFile);
                        setFeaturedImagePreview(URL.createObjectURL(selectedFile));
                      }
                    }}
                  />
                  <br /><br />
                  {featuredImagePreview && (
                    <img
                      src={featuredImagePreview}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                      alt="Featured"
                      className="mt-2 h-40 w-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    className="border border-gray-300 rounded w-full p-2"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleCloseEvent}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditPostModal;
