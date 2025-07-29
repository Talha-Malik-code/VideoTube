import { toast } from 'react-toastify';

const newToast = (type, message) => {
  toast[type](
    <div style={{ color: '#ffffff' }}>
      {message}
    </div>,
    {
      style: {
        backgroundColor: '#010101',   // bg: rgb(1,1,1)
        color: '#ffffff',             // text white
        borderRadius: 0,              // square corners
        boxShadow: '0px 0px 5px 5px #4f4e4e', // same as button's shadow
        border: 'none'
      },
      progressClassName: "!bg-[#ae7aff]",
      autoClose: 4000,
    //   icon: <svg viewBox="0 0 24 24" width="100%" height="100%" fill="fill-[#ae7aff]"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path></svg>
    },
  );
};

export default newToast;