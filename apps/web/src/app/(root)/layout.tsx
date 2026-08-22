import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

