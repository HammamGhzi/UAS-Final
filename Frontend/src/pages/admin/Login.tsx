import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { adminApi } from "../../services/api";
import { LogIn } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.login(form);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("adminToken", token);
        navigate("/admin/dashboard");
      } else {
        setError("Login gagal. Token tidak ditemukan.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Username atau password salah.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-brown-900">
            CANTING
          </h1>
          <p className="text-brown-500 mt-1 text-sm">
            Panel Admin — Batik Tegal
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-brown-900">Masuk</h2>
            <p className="text-brown-500 text-sm mt-1">
              Silakan login dengan akun admin Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Username
              </label>
              <Input
                name="username"
                type="text"
                placeholder="Masukkan username"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-brown-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} CANTING — Sistem Rekomendasi Batik Tegal
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;