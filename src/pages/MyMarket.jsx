import useAuthentication from "../util/useAuthentication";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import NavBarLink from "../components/UI/NavBarLink";
import HelmetIdentify from "../components/HelmetIdentify";

export default function MyMarket() {
  useAuthentication();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <HelmetIdentify
        title={"Motherhood | My Market"}
        description={
          "Buy and sell pre-loved baby items like toys, clothes, and strollers easily on Helmet Baby Care platform."
        }
        keywords={
          "baby market, buy, sell, used baby items, toys, clothes, strollers"
        }
      />
      <div className="market-place my-market max-w-6xl mx-auto mt-10 pb-20 overflow-hidden">
        <div className="my-market-nav gap-8 flex justify-center text-xl font-bold">
          <NavBarLink end to="">
            My Products
          </NavBarLink>
          <NavBarLink to="matket-favorite">Saved Products</NavBarLink>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
