// import { Navigate, Route, RouteObject, Routes, useRoutes } from 'react-router-dom';
// import React, { lazy } from 'react';

// import Dashboard from '@/Render/pages/Home/Dashboard';
// import Layout from '~/src/Render/layout';
// import Login from '@/Render/pages/Login';
// import Manage from '@/Render/pages/Home/Manage';
// import Media from '@/Render/pages/Home/Media';
// import OneStop from '@/Render/pages/Home/OneStop';

// const routeList: RouteObject[] = [
//   { path: '/login', element: <Login /> },
//   {
//     path: '',
//     element: <Layout />,
//     children: [
//       { index: true, element: <Dashboard /> },
//       // { path: '/home/dashboard', element: lazy(() => import('@/Render/pages/Home/Dashboard')) },
//       { path: '/manage', element: lazy(() => import('@/Render/pages/Home/Manage')) },
//       { path: '/onestop', element: lazy(() => import('@/Render/pages/Home/OneStop')) },
//       { path: '/media', element: lazy(() => import('@/Render/pages/Home/Media')) }
//     ]
//   },

//   //   { path: '/', element: <Navigate to="/home" /> },
//   //   {
//   //     path: '/home',
//   //     element: <Navigate to="/home/dashboard" />,
//   //     children: [
//   //       //   { index: true, element: lazy(() => import('@/Render/pages/Home')) },
//   //       { index: true, element: lazy(() => import('@/Render/pages/Home/Dashboard')) },
//   //       { path: '/manage', element: lazy(() => import('@/Render/pages/Home/Manage')) },
//   //       { path: '/onestop', element: lazy(() => import('@/Render/pages/Home/OneStop')) },
//   //       { path: '/media', element: lazy(() => import('@/Render/pages/Home/Media')) }
//   //     ]
//   //   },
//   { path: '*', element: lazy(() => import('@/Render/components/NotFound')) }
// ];

// const RenderRouter: React.FC = () => {
//   const element = useRoutes(routeList);
//   // return element;
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Manage />} />
//         <Route caseSensitive path="/home/dashboard" element={<Dashboard />} />
//         <Route caseSensitive path="/home/manage" element={<Manage />} />
//         <Route path="/home/onestop" element={<OneStop />} />
//         <Route path="/home/media" element={<Media />} />
//         <Route path="*" element={<div>404....</div>} />
//       </Route>
//     </Routes>
//   );
// };

// export default RenderRouter;
