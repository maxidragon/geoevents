import { ConfirmProvider } from 'material-ui-confirm';
import { ThemeProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ForgotPassword from './Pages/Auth/ForgotPassword/ForgotPassword';
import Register from './Pages/Auth/Register/Register';
import ResetPassword from './Pages/Auth/ResetPassword/ResetPassword';
import { createTheme } from '@mui/material';
import Layout from './Layout/Layout';
import Home from './Pages/Home/Home';
import Login from './Pages/Auth/Login/Login';

  
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "auth/login",
          element: <Login />,
        },
        {
          path: "auth/register",
          element: <Register />,
        },
        {
          path: "auth/password/forgot",
          element: <ForgotPassword />,
        },
        {
          path: "auth/password/reset/:resetId",
          element: <ResetPassword />,
        },
      ],
    },
  ]);

  return (
      <ThemeProvider theme={darkTheme}>
        <SnackbarProvider>
          <ConfirmProvider>
            <RouterProvider router={router} />
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
  );
};

export default App
