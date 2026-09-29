import { useNavigate } from "react-router";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx";
import { Label } from "../../components/ui/label.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Button } from "../../components/ui/button.tsx";
import { z } from "zod";
import {useState, type SetStateAction, useContext} from "react";
import { AuthContext } from '@/context/AuthContext.tsx'

export const LoginPage = () => {

  let navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const registerSchema = z.object({
    email: z.email("Format d'email invalide"),
    password: z.string().min(8, "8 caractères minimum").max(32, "32 caractères maximum"),
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
    console.log("Données valides :", result.data);

    authContext?.login(email, password);
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
                Enter your email below to login to your account
              </CardDescription>
              <CardAction>
                <Button variant="link" onClick={() => navigate("/register")}>
                  Sign Up
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
                        value={email}
                        placeholder="m@example.com"
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
                  <p className={"mt-2 text-red-500"}>Password: {errors.password}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
  );
};
