import { LoadingScreen } from "@components/Loading";
import { Outlet } from "react-router-dom";

export function Layout() {
  return <html>{/*...*/}</html>;
}

export function HydrateFallback() {
  return <LoadingScreen />;
}

export default function App() {
  return <Outlet />;
}