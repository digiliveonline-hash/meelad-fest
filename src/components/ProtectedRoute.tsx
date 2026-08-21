import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Checking access...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;