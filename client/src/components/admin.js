import useToken from '../useToken';
import { useNavigate } from 'react-router-dom';
const React = require('react');

const Admin = () => {
    const { token, setToken } = useToken();
    const [categories, setCategories] = React.useState([]);
    const [showPhotos, setPhotoDetails] = React.useState([]);
    const [message, setMessage] = React.useState(null);
    const [formValues, setFormValues] = React.useState({});
    const navigate = useNavigate();
    // fetch and show all photos on admin page
    const showAllRecords = async () => {
        try {
            const response = await fetch('http://localhost:9000/show-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}).then(response => response.json())
                .then((response) => { setPhotoDetails(response)}
        );
        } catch (err) {
            console.error(err.message);
        }
    }

    // get categories ( We can add this function in util and make it reusabled as being used in carousel)
    const getCategories = async () => {
        try {
            const response = await fetch("http://localhost:9000/categories");
            const jsonData = await response.json();
            setCategories(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    //delete selected photo records
    const deleteRecord = async (photID) => {
        try {
            const response = await fetch(`http://localhost:9000/categories/delete/${photID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}).then(response => response.json())
                .then(response => updateTable(response, photID))
        } catch (err) {
            console.error(err.message);
        }
    }

    // update table row once record is deleted
    const updateTable = (response, photID) => {
        setMessage(response);
        const newPhotos = showPhotos.filter((item) => item.id !== photID);
        setPhotoDetails(newPhotos);
    }

    //set form data in react state
    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    // add new record for selected category
    const addNewRecord = async e => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9000/categories/create-photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formValues)
            }).then(response => response.json())
                .then((response) => { addTableRecord(response)});
        } catch (err) {
            console.error(err.message);
        }
    }

    // show record instered msg and update table
    const addTableRecord = (response) => {
        setMessage('New Record Inserted, Please refresh page');
        setPhotoDetails(showPhotos => [...showPhotos,response]);
        //console.log(showPhotos);
    }

    // logout from admin panel
    const logout = () => {
        localStorage.setItem('token','');
        navigate('/login');
    }

    React.useEffect(() => {
        showAllRecords().then(r => null);
        getCategories().then(r => null);
        const removeMessage = setTimeout(() => {
            // After 10 seconds message should be disappeared
            setMessage(false)
        }, 10000)
        return () => {
            clearTimeout(removeMessage)
        }
    }, []);
    
    return (
        <>
            <div className="container-lg">
                {message && (<div className="alert alert-info message">{message}</div>)}
                <div className="table-responsive">
                    <div className="table-wrapper">
                        <div className="table-title">
                            <div className="row">
                                <div className="col-md-4"><h2>Category <b>Details</b></h2></div>
                                <div className="col-md-8">
                                    <a href="#" onClick={() => logout()}>Logout</a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <form className="form-control" onSubmit={addNewRecord}>
                                        <div className="mb-3">
                                            <select className="form-select" name="category_id" onChange={handleChange}>
                                                <option>Select Category</option>
                                                    {categories && categories.map(category => (
                                                            <option value={category.id}>{category.category}</option>
                                                        )
                                                    )}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control" name="photo_url" onChange={handleChange}/>
                                        </div>
                                        <div className="mb-3">
                                            <input type="submit" className="btn btn-info add-new"/>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Category</th>
                                <th>Photo URL</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {token && showPhotos.map(photos => (
                                <tr data-id={photos.id}>
                                    <td>{photos.category}</td>
                                    <td><img src={photos.photo_url} className="table-images" /></td>
                                    <td>
                                        <a className="delete" title="Delete" onClick={() => deleteRecord(photos.id)}>Delete</a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Admin;
