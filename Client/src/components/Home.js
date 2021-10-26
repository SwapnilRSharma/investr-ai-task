import React, { useState, useEffect } from "react";
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

import UserService from "../services/user.service";

const Home = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  // if (!currentUser) {
  //   return <Redirect to="/login" />;
  // }

  useEffect(() => {
    if(currentUser){UserService.getEntries().then(
      (response) => {
        console.log(response.data)
        setData(response.data);
      },
      (error) => {
        // const _content =
        //   (error.response && error.response.data) ||
        //   error.message ||
        //   error.toString();

        // setContent(_content);
      }
    );}
    else{
      // <Redirect to="/login"/>
      return null;
    }
  }, []);

  const handleEdit = (id, index) => {
    console.log(data[index]);
    
  }

  return (
    <div className="container">
      <div>
      <Link 
            to={{
              pathname: "/edit",
              state: {
                name: "",
                about_brand: "",
                brand_image: "",
                product_name: "",
                product_image: "",
                about_product: "",
                isNew: true
              }
            }}
          >
      <button type="button" class="btn btn-dark float-right mb-2" >Add Entry</button>
      </Link>
      </div>
      <table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Brand Name</th>
      <th scope="col">Description</th>
      <th scope="col">Product Name</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
    {data.map((item, index) => (
    <tr key={item.id}>
      <th scope="row">{index+1}</th>
      <td>{item.name}</td>
      <td>{item.about_brand}</td>
      <td>{item.about_product}</td>
      <td>
        <div class="btn-group" role="group" aria-label="Basic example">
          <Link 
            to={{
              pathname: "/edit",
              state: item
            }}
          ><button type="button" class="btn btn-dark mr-1" >Edit</button></Link>
      
        </div>
      </td>
    </tr>
  ))}
  </tbody>
</table>

    </div>
  );
};

export default Home;
