const React = require('react');

const Carousel = () => {
    const [categories, setCategories] = React.useState([]);
    const [photos, setPhotos] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    //get categories ( We can add this function in util and make it reusabled as being used in admin page)
    const getCategories = async () => {
        try {
            const response = await fetch("http://localhost:9000/categories");
            const jsonData = await response.json();
            setCategories(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }
    // apply active class and fetch photos of selected category
    const selectCategory = (catID) => {
        let newCategory = [];
        document.getElementById(`btn-${catID}`).classList.toggle('active');
        const allCategory = Array.from(
            document.querySelectorAll('button.active')
        );
        allCategory.forEach(element => {
            newCategory = (newCategory.length == 0) ? [element.getAttribute('data-id')] : [element.getAttribute('data-id'), ...newCategory];
        });
        fetchGallery(newCategory);
    }

    // show gallery images in carousel of all selected category
    const fetchGallery = async (catID) => {
        if (catID.length > 0) {
            try {
                const response = await fetch('http://localhost:9000/photos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id : catID})
                }).then(response => response.json())
                    .then((response) => {
                        setPhotos(response);
                    });
            } catch (err) {
                console.error(err.message);
            }
        } else {
            setPhotos([]);
        }
    }

    React.useEffect(() => {
        getCategories().then(r => null);
    }, []);

    return (
        <div className="container">
            <div className="row">
                {categories.map(category => (
                    <div className="col" key={category.id}>
                        <button data-id={`${category.id}`} id={`btn-${category.id}`} className={`btn btn-dark category-btn`} onClick={() => selectCategory(category.id)}>{category.category}</button>
                    </div>
                ))}
            </div>
            <div className="carousel-container">
                <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-interval={null}
                     data-bs-ride="false">
                    {photos && photos.length ? (
                        <>
                            <div className="carousel-inner">
                                {photos.map((photo, index) => {
                                    return (
                                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                            <img src={photo.photo_url} className="carousel-image"/>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            <button className="carousel-control-prev" type="button"
                                    data-bs-target="#carouselExampleDark"
                                    data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button"
                                    data-bs-target="#carouselExampleDark" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </>
                    ) : ''
                    }
                </div>
            </div>
        </div>
    )
};

export default Carousel;
