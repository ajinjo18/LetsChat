import "./CropImageMain.css";
import { useEffect, useState } from "react";
import ImageCropDialog from "./ImageCropDialog";


const CropImageMain = ({initData, save}) => {
  const [cars, setCars] = useState(initData);

  const sendDataToParent = () => {
    save(cars); 
  };

  useEffect(()=>{
    setCars(initData)
  },[initData])

  const [selectedCar, setSelectedCar] = useState(null);

  const onCancel = () => {
    setSelectedCar(null);
  };

  const setCroppedImageFor = (id, crop, zoom, aspect, croppedImageUrl) => {
    const newCarsList = [...cars];
    const carIndex = cars.findIndex((x) => x.id === id);
    const car = cars[carIndex];
    const newCar = { ...car, croppedImageUrl, crop, zoom, aspect };
    newCarsList[carIndex] = newCar;
    setCars(newCarsList);
    setSelectedCar(null);
  };

  

  const resetImage = (id) => {
    setCroppedImageFor(id);
  };

  const removeCar = (id) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== id));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)'}}>
      {selectedCar ? (
        <ImageCropDialog
          id={selectedCar.id}
          imageUrl={selectedCar.imageUrl}
          cropInit={selectedCar.crop}
          zoomInit={selectedCar.zoom}
          aspectInit={selectedCar.aspect}
          onCancel={onCancel}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
        />
      ) : null}
      {cars.map((car) => (
        <div className="imageCard" key={car.id}>
          <img
            src={car.croppedImageUrl ? car.croppedImageUrl : car.imageUrl}
            alt=""
            onClick={() => {
              console.log(car);
              setSelectedCar(car);
            }}
          />
            <button onClick={() => removeCar(car.id)}>Delete</button>
        </div>
      ))}
      {
        cars.length > 0 && (
          <div style={{ gridColumn: 'span 4', textAlign: 'right' }}>
            <button onClick={sendDataToParent}>Post</button>
        </div>
        )
      }
    </div>
  );
}

export default CropImageMain;