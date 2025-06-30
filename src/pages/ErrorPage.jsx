import { Helmet } from "react-helmet-async";
import ErrorCard from "../components/ErrorPage/ErrorCard";
import MainNavigationBar from "../components/MainNavigationBar";

export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title>Motherhood | Error Page</title>
      </Helmet>
      <MainNavigationBar />
      <main className="max-w-6xl mx-auto mt-10 pb-20">
        <ErrorCard />
      </main>
    </>
  );
}
