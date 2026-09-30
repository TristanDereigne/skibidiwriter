import { useNavigate } from "react-router";

import { AuthContext } from "@/context/AuthContext.tsx";
import { useContext, useState, type SetStateAction } from "react";
import { z } from "zod";
import { Button } from "../../components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";

export const RegisterPage = () => {
  let navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const registerSchema = z.object({
    email: z.email("Format d'email invalide"),
    pseudo: z
      .string()
      .min(3, "3 caractères minimum")
      .max(20, "20 caractères maximum")
      .regex(
        /\w/,
        "Le pseudo ne peut contenir que des lettres, chiffres et underscore",
      ),
    password: z
      .string()
      .min(8, "8 caractères minimum")
      .max(32, "32 caractères maximum"),
  });

  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    verifyPassword?: string;
    pseudo?: string;
  }>({});

  const handleChange = (e: {
    target: { id: string; value: SetStateAction<string> };
  }) => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "pseudo") {
      setPseudo(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    } else if (e.target.id === "verifyPassword") {
      setVerifyPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ email, password, pseudo });

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        pseudo: fieldErrors.pseudo?.[0],
      });
      return;
    } else if (password != verifyPassword) {
      setErrors({
        verifyPassword: "Passwords do not match",
      });
      return;
    }

    setErrors({});
    console.log("Données valides :", result.data);

    authContext?.register(email, password, pseudo);
  };

  return (
    <div
      className={"w-screen h-screen flex flex-col justify-center items-center"}
    >
      <Card className="w-full max-w-md shadow-xl shadow-[#6957DF]/10">
        <form
          action=""
          onSubmit={handleSubmit}
          className={"w-full gap-2 flex flex-col"}
        >
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email below to register an account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className={"mt-4"}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Pseudo</Label>
                  <Input
                    id="pseudo"
                    type="text"
                    autoComplete="username"
                    value={pseudo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Verify Password</Label>
                  </div>
                  <Input
                    id="verifyPassword"
                    type="password"
                    autoComplete="new-password"
                    value={verifyPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {errors.email && (
              <p className={"mt-2 text-red-500"}>Email: {errors.email}</p>
            )}
            {errors.pseudo && (
              <p className={"mt-2 text-red-500"}>Pseudo: {errors.pseudo}</p>
            )}
            {errors.password && (
              <p className={"mt-2 text-red-500"}>Password: {errors.password}</p>
            )}
            {errors.verifyPassword && (
              <p className={"mt-2 text-red-500"}>{errors.verifyPassword}</p>
            )}
            {!errors.email && !errors.password && !errors.verifyPassword && (
              <div className={"mt-2"}></div>
            )}
            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
