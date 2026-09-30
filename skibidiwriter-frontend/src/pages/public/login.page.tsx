import { useNavigate } from "react-router";

import { toast } from "@/components/ui/toast.tsx";
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

export const LoginPage = () => {
  let navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const registerSchema = z.object({
    email: z.email("Format d'email invalide"),
    password: z
      .string()
      .min(8, "8 caractères minimum")
      .max(32, "32 caractères maximum"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: {
    target: { id: string; value: SetStateAction<string> };
  }) => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});

    try {
      await authContext?.login(email, password);
    } catch (error) {
      toast.add({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : undefined,
        type: "error",
      });
    }
  };

  return (
    <div
      className={"w-screen h-screen flex flex-col justify-center items-center gap-14"}
    >
      <div className={"text-center text-6xl font-bold max-w-md w-full"}>
        <h1 className={"text-[#432DD7]"}>Skibidi Writer.</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl shadow-[#6957DF]/10">
        <form
          action=""
          onSubmit={handleSubmit}
          className={"w-full gap-2 flex flex-col"}
        >
          <CardHeader className={"flex flex-row"}>
            <div className={"flex flex-col"}>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>
                Renseigner vos identifiants ci-dessous pour vous connecter
              </CardDescription>
            </div>
            <CardAction>
              <Button variant="link" className={"relative bottom-1"} onClick={() => navigate("/register")}>
                S'inscrire ?
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
                    placeholder="m@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
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
            {errors.password && (
              <p className={"mt-2 text-red-500"}>Mot de passe: {errors.password}</p>
            )}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
            <Button variant="outline" className="w-full">
              Se connecter avec Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
