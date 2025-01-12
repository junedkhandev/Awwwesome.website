import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function Home() {
  const [website, setWebsite] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  console.log("filteredWebsites", filteredWebsites);
  const [user, setUser] = useState({});
  console.log(user);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();


  // const categoryarray = ["All", "AI", "Design", "Tools","Books","Productivity","Resources"]
  // const [categoryarray, setCategoryarray] = useState(["All", "AI", "Design", "Tools","Books","Productivity","Resources"]);

  const [categoryarray, setCategoryarray] = useState(["All", "AI", "Design", "Tools","Books","Productivity","Resources"]);


  const iconname = (arg) => {
    const myarg = arg
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split(/[/?#]/)[0];
    return `http://www.google.com/s2/favicons?domain=${myarg}`;
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate("/");
        location.reload();
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };

  const handleCategoryChange = (category) => {
    console.log("cliked catergory is  "+ category);
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredWebsites(website);
    } else {
      const filtered = website.filter((site) => site.tag === category);
      console.log("filtered>>>>>>>>>>> ", filtered);
      setFilteredWebsites(filtered);
    }
  };

  async function EditWebsite(website) {
    const websiteName = prompt("Enter the name of the website", website.name);
    const websiteLink = prompt("Enter the link of the website", website.link);
    const websiteDesc = prompt("Enter the description of the website", website.desc);
    const websiteTag = prompt("Enter the Tag", website.tag);

    if (websiteDesc !== null && websiteLink !== null && websiteName !== null && websiteTag !== null) {
      updatePostInDB(website.id, websiteName, websiteLink, websiteDesc, websiteTag);
    } else {
      alert("Update cancelled or incomplete information provided.");
    }
  }

  async function updatePostInDB(docID, websiteName, websiteLink, websiteDesc, websiteTag) {
    try {
      const postRef = doc(db, "website", docID);
      await updateDoc(postRef, {
        name: websiteName,
        link: websiteLink,
        desc: websiteDesc,
        tag: websiteTag,
      });
      alert("Website updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update document: " + error.message);
    }
  }

  async function DeleteWebsite(website) {
    alert("You are about to delete website with ID: " + website.id);
    try {
      await deleteDoc(doc(db, "website", website.id));
      alert("Website deleted successfully!");
    } catch (error) {
      console.error("Error deleting website: ", error);
      alert("Failed to delete website: " + error.message);
    }
  }

  const renderWebsites = () => {
    return filteredWebsites.map((website) => (
      <div className="container" key={website.id}>
        <div className="tag">{website.tag}</div>
        <a href={website.link} target="_blank" rel="noreferrer">
          <div className="tile">
            <div className="icon">
              <img src={iconname(website.link)} alt={website.name} />
            </div>
            <div>
              <h4>{website.name}</h4>
              <p>{website.desc}</p>
            </div>
          </div>
        </a>
        {user.email && (
          <>
            <button onClick={() => DeleteWebsite(website)} id="delbtn">
              ❌
            </button>
            <button onClick={() => EditWebsite(website)} id="editbtn">
              ✏️
            </button>
          </>
        )}
      </div>
    ));
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate("/");
      } else {
        console.log("User not signed in");
      }
    });
  }, []);

  const [newsite, setNewsite] = useState({
    name: "",
    link: "",
    desc: "",
    tag: "",
  });
  console.log(newsite);

  function handlechange(e) {
    setNewsite((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }


  const addtodatabse = async () => {
    // const websiteName = prompt("Enter the name of the website");
    // const websiteLink = prompt("Enter the link of the website");
    // const websiteDesc = prompt("Enter the description of the website");
    // const websiteTag = prompt("Enter the Tag");

    const websiteName = newsite.name;
    const websiteLink = newsite.link;
    const websiteDesc = newsite.desc;
    const websiteTag = newsite.tag;

    if (websiteName && websiteLink && websiteDesc && websiteTag) {
      try {
        await addDoc(collection(db, "website"), {
          name: websiteName,
          link: "http://" + websiteLink,
          desc: websiteDesc,
          tag: websiteTag,
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "website"), (snapshot) => {
      const websitesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWebsite(websitesList);
      setFilteredWebsites(websitesList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategoriesList(categories);
    
    });

    return () => unsubscribe();
  }, []);


  


  const [category, setCategory] = useState({
    name: "",
    emoji: "",
  });
  
  const [categoriesList, setCategoriesList] = useState([]);
  
  console.log(categoriesList);
  const addcategorytodb = async () => {
    // const category = prompt("Enter the name of the category");
    
    if (category) {
      try {
        await addDoc(collection(db, "categories"), {
          name: category.name,
          emoji: category.emoji,
         
        });
        alert("Category added successfully!");
        setCategory("");
        // setCategoryarray([...categoryarray, category]);
        

      } catch (error) {
        console.error(error.message);
      }
    }
  }
 
  return (
    <>
    <div className="dadacontainer">
    {
      user.email && <div className="adminpanel">
      <input type="text" placeholder="website name" name="name" value={newsite.name} onChange={handlechange} />
      <input type="text" placeholder="website link"  name="link" value={newsite.link} onChange={handlechange}/>
      <textarea placeholder="website description" name="desc" value={newsite.desc} onChange={handlechange}/>

      <select  id="categories" name="tag" value={newsite.tag} onChange={handlechange}>
        {/* <option value="Ai">ai</option>
        <option value="ci">ci</option> */}
        {
          categoriesList.map((category) => {
            return <option key={category.id} value={category.name}>{category.emoji}{category.name}</option>
          
          })
        }
      </select>

            <div> 
            <button onClick={addtodatabse}>Add</button>    
            <button  onClick={handleSignOut}>Sign Out </button>
            </div>

            
            <div>
            <input type="text" placeholder="add emoji" value={category.emoji} onChange={(e) =>  setCategory(prev => ({ ...prev, emoji: e.target.value }))}/>
            <input type="text" placeholder="add category" value={category.name} onChange={(e) => setCategory(prev => ({...prev, name: e.target.value}))}/>
            <button  onClick={addcategorytodb}>+</button>
            </div>
          
     </div>
    }
      
    <div className="baapcontainer">

    {/* style={{
      marginLeft: "350px",
      backgroundColor: "black",
    }}> */}

   

      <div className="hero" >
        <h1>
          A<span id="www">www</span>esome Website
        </h1>
      </div>
      <div className="category-buttons">
        
        {categoriesList.map((category) => (
          <>
          <div className="buttoncontainer">

         
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.name ? "active" : ""}`}
            onClick={() => handleCategoryChange(category.name)}
            >
              {category.emoji}
            {category.name}
          </button>
          {/* <p id="totalnumberofwebsites"> 123</p> */}
              <p id="totalnumberofwebsites">
                {category.name === "All"
                  ? website.length
                  : website.filter((site) => {
                    const emojifilteredname = category.name;
                    const sitetag = site.tag;
                    return sitetag === emojifilteredname;
                    }).length}
              </p>

              </div>
            </>
        ))}
      </div>
        <div className="maincontainer">{renderWebsites()}</div>
      </div>
    </div>
     <footer>
      <a href="https://www.instagram.com/awwwesome.website/" target="_blank" rel="noreferrer">
        <img src="https://icons.iconarchive.com/icons/fa-team/fontawesome-brands/512/FontAwesome-Brands-Instagram-icon.png" alt="instagram of awwwesome.website" />
      </a>
     </footer>
    </>
  );
}

export default Home;
