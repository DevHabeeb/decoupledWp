import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useState } from 'react';
import {ClassicEditor, Bold,
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
  Undo  } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

const AddPostModal = ({ handleCloseEvent, categoriesList, fetchWordPressPosts }) => {

  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [status, setStatus] = useState("");

  // Handle form submission
  const handleFormSubmitData = async (e) => {
    e.preventDefault();

    let featuredImageID = null;
    // Upload media to wordpress and get back the media ID
    if (featuredImage) {
      featuredImageID = await handleFeaturedImageUpload(featuredImage)
    }
    

    const postData = {
      title,
      categories: [category],
      content: editorContent,
      featured_media: featuredImageID,
      status
    };
    console.log(postData);

    try { 
      const apiResponse = await fetch("https://idl-3d.xyz/wp-json/wp/v2/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic "+ btoa("DevHabeeb:PcIr TSS6 gqSD Mcof FUIT Mim7")
        },
        body: JSON.stringify(postData)
      })

      const apiData = await apiResponse.json();
      // console.log("Post created successfully:", apiData);
      handleCloseEvent();
      fetchWordPressPosts();
    } catch (error) {
      console.error("Error creating post:", error);
  } 

  };


  //Upload featured image 
  const handleFeaturedImageUpload = async (featuredImageFile) => {

    try {
      const formData = new FormData();
      formData.append('file', featuredImageFile);
      formData.append('alt_text', "Featured Image of Post");

      const apiResponse = await fetch("https://idl-3d.xyz/wp-json/wp/v2/media", {
        method: "POST",
        headers: {
          "Authorization": "Basic "+ btoa("DevHabeeb:PcIr TSS6 gqSD Mcof FUIT Mim7")
        },
          body: formData
    })
  
    const apiData = await apiResponse.json();
    

    return apiData.id;
  
  } catch (error) {
      console.error("Error uploading featured image:", error);
      
    }
   
  }
    return <>
    <div className="modal" id="addPostModal">
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/25" onClick={handleCloseEvent}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative" onClick={(e) => e.stopPropagation()}>
              <div className="loader"></div> 
              <h2 className="text-2xl mb-4">Add New Post</h2>
              <form onSubmit={handleFormSubmitData}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded w-full p-2"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
        
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      className="border border-gray-300 rounded w-full p-2"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option >
                        Select Category
                      </option>
                      {
                        Object.entries(categoriesList).map(([index, value]) => (
                          <option key={index} value={index}>
                            {value}
                          </option>
                        ))
                      }
                    </select>
                  </div>
        
                  <div className="mb-4 col-span-2">
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <CKEditor  
                      editor={ClassicEditor}
                      data={editorContent}
                      config={ {
    // CRITICAL: This tells CKEditor 5 you are using the free open-source license
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
        initialData: '<h1>Hello from CKEditor 5!</h1>',
   
  } }
                      
                      onChange={(e, editor) => {
                        const editorData = editor.getData();
                        setEditorContent(editorData);
                        // Handle content change 
                      }}
                     
                    
                    />
                  </div>
        
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Featured Image</label>
                    <input
                    className="p-4 border border-gray-300 bg-gray-100 cursor-pointer rounded"
                      type="file"
                      onChange={(e) => setFeaturedImage(e.target.files[0])}
                    />
                  </div>
        
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      className="border border-gray-300 rounded w-full p-2"
                      required
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">- Select -</option>
                      <option value="publish">Publish</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
        
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleCloseEvent}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
        </div>
    </div>
    </>

}

export default AddPostModal;