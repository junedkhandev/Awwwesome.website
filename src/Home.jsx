
import React from "react";

import { useState, useEffect } from 'react';

import { signOut, onAuthStateChanged } from 'firebase/auth';

import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';

//we early use getDocs to get the docs for for realtime updates we use onSnapshot
import {  addDoc, getFirestore, collection, query, onSnapshot, where, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

function Home() {

  const [website, setWebsite] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [uid, setUid] = useState("");

  const iconname = (arg) => {
    const myarg = arg.replace('https://', '').replace('http://', '').replace('www.', '').split(/[/?#]/)[0];
    return `http://www.google.com/s2/favicons?domain=${myarg}`;
      
      //example input: https://10web.io/
      // example ouput: http://www.google.com/s2/favicons?domain=10web.io
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate("/");
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };


  function EditWebsite(website) {
    const websiteName = prompt("Enter the name of the website", website.name);
    const websiteLink = prompt("Enter the link of the website", website.link);
    const websiteDesc = prompt("Enter the description of the website", website.desc);

    if (websiteDesc !== null && websiteLink !== null && websiteName !== null) {
      updatePostInDB(website.id, websiteName, websiteLink, websiteDesc);
    } else {
      alert("Update cancelled or incomplete information provided.");
    }
  }

  async function updatePostInDB(docID, websiteName, websiteLink, websiteDesc) {
    console.log("Updating document with ID: ", docID);
    try {
      const postRef = doc(db, "website", docID);
      await updateDoc(postRef, {
        name: websiteName,
        link: websiteLink,
        desc: websiteDesc
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

  const renderPeople = () => {
    return website.map(website => (
      <div className="container" key={website.id}>
        <a href={website.link} target="_blank">
          <div className='tile'>
            <div className='icon'>
              <img src={iconname(website.link)} alt={website.name} />
            </div>
            <div>
              <a href={website.link} target="_blank" rel="noreferrer">
                <h4>{website.name}</h4>
              </a>
              <p>{website.desc}</p>
            </div>
          </div>
        </a>
        {user.email ? (
          <>
            <button onClick={() => { DeleteWebsite(website) }} id="delbtn">❌</button>
            <button onClick={() => { EditWebsite(website) }} id="editbtn">✏️</button>
          </>
        ) : ''}
      </div>
    ));
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUid(user.uid);
        navigate("/");
      } else {
        console.log("User not signed in");
      }
    });
  }, []);

  const addtodatabse = async () => {
    const websiteName = prompt("Enter the name of the website");
    const websiteLink = prompt("Enter the link of the website");
    const websiteDesc = prompt("Enter the description of the website");

    if (websiteName && websiteLink && websiteDesc) {
      try {
        const docRef = await addDoc(collection(db, "website"), {
          name: websiteName,
          link: 'http://' + websiteLink,
          desc: websiteDesc
        });

        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error(error.message);
      }
    }
  };


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, 'website'));
  //       console.log("this is query snapshot" + querySnapshot.docs)
  //       const websitesList = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       setWebsite(websitesList);
  //     } catch (e) {
  //       console.error("Error fetching documents: ", e);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'website'), (snapshot) => {

      

      const websitesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWebsite(websitesList);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="container">
        {renderPeople()}
      </div>
      {user.email ? (
        <>
          <button id="signoutbtn" onClick={handleSignOut}>Sign Out</button>
          <button id="addbtn" onClick={addtodatabse}>Add</button>
        </>
      ) : ''}
      <footer>
        <a href="https://linktr.ee/developedbyjk" target="_blank"> @developedbyjk👨‍💻</a>
      </footer>
    </>
  );
}

export default Home;
