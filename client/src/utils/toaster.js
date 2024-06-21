import { toast } from 'react-toastify';



const errorMessage = (message) => {
    toast.error(message, {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
};

const successMessage = (message) => {
    toast.success(message, {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  
};

export { errorMessage, successMessage }
