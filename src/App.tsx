import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { About } from "./pages/About"
import { Account } from "./pages/Account"
import { ForgotPassword, Login, Register, ResetPassword, VerifyEmail } from "./pages/Auth"
import { Cart } from "./pages/Cart"
import { Catalog } from "./pages/Catalog"
import { Contact } from "./pages/Contact"
import { Home } from "./pages/Home"
import { Info } from "./pages/Info"
import { Product } from "./pages/Product"
import { SizeGuide } from "./pages/SizeGuide"
import { Tailoring } from "./pages/Tailoring"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Navigate to="/cart" replace />} />
        <Route path="/payment" element={<Navigate to="/cart" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/account" element={<Account />} />
        <Route path="/tailoring" element={<Tailoring />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/payment-methods" element={<Navigate to="/" replace />} />
        <Route path="/faq" element={<Info page="faq" />} />
        <Route path="/returns" element={<Info page="returns" />} />
        <Route path="/privacy" element={<Info page="privacy" />} />
        <Route path="/terms" element={<Info page="terms" />} />
        <Route path="/shipping-info" element={<Info page="shipping" />} />
      </Routes>
    </Layout>
  )
}
