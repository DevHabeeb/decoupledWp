import AddPostModal from "./Modal/AddPostModal";
import { useState, useEffect } from "react";
import EditPostModal from "./Modal/EditPostModal";


const PostList = () => {


  const [addPostModalFlag, setAddPostModalFlag] = useState(false);
  const [editPostModalFlag, setEditPostModalFlag] = useState(false);
  const [posts, setPosts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [featuredMediaImages, setFeaturedMediaImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editPostId, setEditPostId] = useState(null);
  const [defaultFeaturedImage, setDefaultFeaturedImage] = useState("INPUT_ENDPOINT/wp-content/uploads/2026/02/Contact-Image.webp");


  const toggleAddPostModalFlag = () => {
    setAddPostModalFlag(prev => !prev);
  }

  const toggleEditPostModalFlag = (postId) => {
    setEditPostModalFlag(prev => !prev);
    setEditPostId(postId);
  }

//List of posts from WordPress REST API
  const fetchWordPressPosts = async () => {
    try {
      setIsLoading(true); // Trigger loading before API execution

      const apiResponse = await fetch("INPUT_ENDPOINT", {
        "method": "GET",
        "headers": {
          "Authorization": "Basic " + btoa("INPUT_USERNAME:INPUT_PASSWORD")
        }
      }
      )

      if (!apiResponse.ok) {
        const responseText = await apiResponse.text();
        console.error("Error fetching posts: Status", apiResponse.status);
        console.error("Response body:", responseText);
        setPosts([]);
        setIsLoading(false);
        return;
      }
      
      const responseText = await apiResponse.text();
      console.log("Raw response:", responseText.substring(0, 500));
      
      let listPosts;
      try {
        listPosts = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        setPosts([]);
        setIsLoading(false);
        return;
      }
      
      if (!Array.isArray(listPosts)) {
        console.error("Expected array of posts, got:", typeof listPosts, listPosts);
        setPosts([]);
        setIsLoading(false);
        return;
      }
      
      setPosts(listPosts);

      const featuredMediaImages = await fetchWordPressFeaturedMediaImages(listPosts);

      setFeaturedMediaImages(featuredMediaImages);
      setIsLoading(false); // Stop loading after API execution
    }



    catch(error) {
      console.log("Error in fetchWordPressPosts:", error);
      setPosts([]);
      setIsLoading(false); // Stop loading in case of error
    }

    }

    // Generate JWT Token Value
    // const generateJWTTokenValue = async () => {
    //   try {
    //     const apiResponse = await fetch("INPUT_ENDPOINT/wp-json/jwt-auth/v1/token", {
    //       "method": "POST",
    //       "headers": {  
    //         "Content-Type": "application/json"
    //   }, 
    //   body: JSON.stringify({
    //     username: "root",
    //     password: "root"
    //   })
    // })
  
    //   const apiData = await apiResponse.json();
    //   window.localStorage.setItem("jwtToken", apiData.token);
    // console.log("JWT Token Value:", apiData);
    // await validateJWTToken(apiData.token);}
    //    catch(error) {
    //     console.log(error);
    //   }
    // }

  //   const validateJWTToken = async (token) => {
  //     try {
  //       const apiResponse = await fetch("INPUT_ENDPOINT/wp-json/jwt-auth/v1/token/validate", {
  //         "method": "POST",
  //         "headers": {  
  //           "Content-Type": "application/json",
  //           "Authorization": "Bearer " + token
  //     }
  //   })
  // const apiData = await apiResponse.json();
  // console.log("JWT Token Validation Response:", apiData);}
  //       catch(error) {
  //         console.log(error);
  //       }
  //     }

  useEffect(() => {
    //Generate Token Value
      // generateJWTTokenValue();
      fetchWordPressPosts();
      fetchWordPressPostsCategories();
  }, []);


  //Post Status

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={`skeleton-${index}`} className="animate-pulse">
        <td className="px-6 py-4">
          <div className="mx-auto h-4 w-8 rounded bg-gray-200" />
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
        </td>
        <td className="px-6 py-4">
          <div className="h-12 w-12 rounded-lg border border-gray-200 bg-gray-100" />
        </td>
        <td className="px-6 py-4 text-right">
          <div className="ml-auto flex justify-end gap-2">
            <div className="h-8 w-16 rounded-md bg-gray-200" />
            <div className="h-8 w-16 rounded-md bg-gray-100" />
          </div>
        </td>
      </tr>
    ));
  };

  const getPostStatusButton = (status) => {

    if (status == "draft") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white uppercase tracking-wide">
                    {status}
                  </span>
      )
    } else if (status == "publish") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white uppercase tracking-wide">
                    {status}
                  </span>
      )
    }

  }


  // Fetch Categories

   const fetchWordPressPostsCategories = async () => {
    try {

      const apiResponse = await fetch("INPUT_ENDPOINT/wp-json/wp/v2/categories", {
        "method": "GET",
        "headers": {
          "Authorization": "Basic " + btoa("INPUT_USERNAME:INPUT_PASSWORD")
        }
      }
      )

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error("Error fetching categories:", apiResponse.status, errorData);
        return;
      }
      
      const apiData = await apiResponse.json();

      const categoryObjectData = apiData.reduce( (categoryObject, singleCategoryObject) => {
        categoryObject[singleCategoryObject.id] = singleCategoryObject.name;
        return categoryObject;
      }, {} )


      setCategories(categoryObjectData);
      
      
      
    }

    
    


    catch(error) {
      console.log("Error in fetchWordPressPostsCategories:", error);
      
    }

    }

    // Fetch Featured Media Images

    const fetchWordPressFeaturedMediaImages = async (listofPosts) => {


      const mediaImagesArray = [];


      await Promise.all(
        listofPosts.map( async (singlePostObject, index) => {

          if (singlePostObject.featured_media > 0) {

            try {

              const apiResponse = await fetch("INPUT_ENDPOINT/wp-json/wp/v2/media/" + singlePostObject.featured_media, {
                "method": "GET",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": "Basic " + btoa("INPUT_USERNAME:INPUT_PASSWORD")
                }
              });

              const apiData = await apiResponse.json();
              mediaImagesArray[singlePostObject.id] = apiData.source_url;

            } catch (error) {
              console.log(error);
              mediaImagesArray[singlePostObject.id] = defaultFeaturedImage;
            }
          } 
          else {
            mediaImagesArray[singlePostObject.id] = defaultFeaturedImage;
          }
        } ) )
      
      
        return mediaImagesArray;
      
      
      }


  // Delete Post
  const handlePostDelete = async (postId) => {
    try { if (window.confirm("Are you sure you want to delete this post?")) {
       const apiResponse = await fetch("INPUT_ENDPOINT/wp-json/wp/v2/posts/" + postId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic "+ btoa("INPUT_USERNAME:INPUT_PASSWORD")
        }
      })

      const apiData = await apiResponse.json();
      fetchWordPressPosts();
    }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 max-w-7xl loader">
      

        {/* Dashboard Top Header Actions Row */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and organize your site content entries</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition duration-150 cursor-pointer" 
            onClick={toggleAddPostModalFlag}
          >
            Add Post
          </button>
        </div>

        {/* Semantic Content Data Table Wrapper */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4 w-16 text-center">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 w-32">Featured Image</th>
                <th className="px-6 py-4 text-right w-44">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {isLoading ? (
                renderSkeletonRows()
              ) : (
                posts.map((singlePost) => (
                  <tr key={singlePost.id} className="hover:bg-gray-50/70 transition duration-150">
                    {/* ID */}
                    <td className="px-6 py-4 text-center font-medium text-gray-400">{singlePost.id}</td>

                    {/* Title */}
                    <td className="px-6 py-4 font-semibold text-gray-900">{singlePost.title.rendered}</td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {getPostStatusButton(singlePost.status)}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-500 italic">{categories[singlePost?.categories[0]] || 'No Category'}</td>

                    {/* Thumbnail Image */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                        <img
                          src={featuredMediaImages[singlePost.id] || defaultFeaturedImage}
                          alt={singlePost.featured_media || 'default-featured-image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Action Controls */}
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button className="bg-white border border-gray-300 hover:bg-blue-500 hover:text-white text-gray-700 font-medium py-1.5 px-3 rounded-md shadow-sm text-xs transition duration-150 cursor-pointer" onClick={() => toggleEditPostModalFlag(singlePost.id)}>
                        Edit
                      </button>
                      <button onClick={() => handlePostDelete(singlePost.id)}
                        className="bg-red-600 hover:bg-red-800 text-white disabled:opacity-40 disabled:hover:bg-transparent font-medium py-1.5 px-3 rounded-md text-xs transition duration-150 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          { addPostModalFlag && <AddPostModal handleCloseEvent={toggleAddPostModalFlag} categoriesList={categories} fetchWordPressPosts={fetchWordPressPosts}  />}

          { editPostModalFlag && <EditPostModal handleCloseEvent={toggleEditPostModalFlag} categoriesList={categories} postId={editPostId} fetchWordPressPosts={fetchWordPressPosts} /> }

        </div>
      </div>
    </>
  )
}

export default PostList;