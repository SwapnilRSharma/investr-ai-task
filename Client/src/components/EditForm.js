import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import TextField from '@mui/material/TextField';
import UserService from "../services/user.service";
import { useHistory } from "react-router-dom";

const EditForm = (props) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { state } = props.location
  const history = useHistory();

  const [data , setData] = useState(
    {
        ...state
    }
);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const handleImageUpload = () => {

  }

  let newD;
  const handleInputChange = (e) => {
    newD = { ...data }
    newD[e.target.id] = e.target.value
    state.name = e.target.value
    setData(newD)
    console.log(newD)
  }
//   console.log(this.state)
//   console.log(this.data)

const handleImageChange = (e) => {
  console.log(e.target.value)
  const type = e.target.id
  const fd = new FormData();
  fd.append('image', e.target.files[0])
    UserService.uploadImage(fd).then(
        (response) => {
            console.log(response.data.fileLocation)
            newD = { ...data }
            newD[type] = response.data.fileLocation
            setData(newD)
            alert('Image uploaded successfully')
        })
}

const handleSave = (e) => {
  e.preventDefault()

  UserService.createEntry(data).then(
    (response) => {
        alert('Entry saved!')
    })
    .catch((error) => alert(error))
}

const handleUpdate = (e) => {
  e.preventDefault()

  UserService.updateEntry(data).then(
    (response) => {
        alert('Entry saved!')
    })
    .catch((error) => alert(error))
} 

const handleDeleteImageBrand = (e) => {
  e.preventDefault()
  newD = { ...data }
  newD['brand_image'] = ""
  console.log(newD)
  setData(newD)
}

const handleDeleteImageProduct = (e) => {
  e.preventDefault()
  
  newD = { ...data }
  newD['product_image'] = ""
  console.log(newD)
  setData(newD)
}

const handleDeleteEntry = (e) => {
  e.preventDefault()
  UserService.deleteEntry(data._id)
    .then((response) => {
      alert('Deleted successfully!')
      history.push('/');
    })
    .catch((err) => alert(err))
}

  return (
      
    <div className="container">
      <form>
        <div class="form-group">
            <label for="name">Brand Name</label>
            <input type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Enter brand name"
                value={data.name}  onChange={(e) => handleInputChange(e)}/>
            
        </div>
        <div class="form-group">
            <label for="about_brand">Brand Description</label>
            <textarea type="text" class="form-control" id="about_brand" aria-describedby="emailHelp" placeholder="Enter brand description"
                value={data.about_brand} onChange={(e) => handleInputChange(e)} />
        </div>
        { data.brand_image == "" ?  
            <div>
            <input type="file" id="brand_image" name="files" title="Load File" class="mb-4" accept="image/png, image/gif, image/jpeg"
              onChange={(e)=> handleImageChange(e)}/>
          </div>
            : 
            <div><button class="btn btn-dark mr-1" onClick={(e) => {
              e.preventDefault()
              window.open(data.brand_image, "_blank")
              }}>View Image</button><button class="btn btn-dark" onClick={(e) => handleDeleteImageBrand(e)}>Delete Image</button></div> }
        <div class="form-group">
            <label for="product_name">Product Name</label>
            <input type="text" class="form-control" id="product_name" placeholder="Product Name" value={data.product_name} 
              onChange={(e) => handleInputChange(e)}/>
        </div>
        <div class="form-group">
            <label for="about_product">Product Description</label>
            <textarea type="text" class="form-control" id="about_product" aria-describedby="emailHelp" placeholder="Enter brand description"
                value={data.about_product} onChange={(e) => handleInputChange(e)}/>
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        { data.product_image == "" ?
            <div>
                <input type="file" id="product_image" name="files" title="Load File" class="mb-4" accept="image/png, image/gif, image/jpeg" 
                  onChange={(e)=> handleImageChange(e)}/>
                
            </div>
            : 
            <div><button class="btn btn-dark mb-6 mr-1" onClick={(e) => {
              e.preventDefault()
              window.open(data.product_image, "_blank")
              }}>View Image</button><button class="btn btn-dark mb-6" onClick={(e) => handleDeleteImageProduct(e)}>Delete Image</button>
            
            </div> 
            }

        {
            data.isNew == true ?
                <button class="btn btn-dark mr-1 mt-4" onClick={(e) => handleSave(e)}>Save</button>
            :
            <div><button class="btn btn-dark mr-1 mt-4" onClick={((e)=> handleUpdate(e))}>Update</button><button class="btn btn-dark mt-4" onClick={(e) => handleDeleteEntry(e)}>Delete</button></div>
        }
        
      </form>
    </div>
  );
};

export default EditForm;
