import { zodResolver } from "@hookform/resolvers/zod";
import { t, Trans } from "@lingui/macro";
import { ArrowRight, Warning } from "@phosphor-icons/react";
import { registerSchema } from "@reactive-resume/dto";
import { usePasswordToggle } from "@reactive-resume/hooks";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { AxiosError } from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { toast } from "@/client/hooks/use-toast";
import { useRegister } from "@/client/services/auth";

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useRegister();

  const formRef = useRef<HTMLFormElement>(null);
  usePasswordToggle(formRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      locale: "en",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await register(data);

      navigate("/auth/verify-email");
    } catch (error) {
      form.reset();

      if (error instanceof AxiosError) {
        const message = error.response?.data.message || error.message;

        toast({
          variant: "error",
          icon: <Warning size={16} weight="bold" />,
          title: t`An error occurred while trying to create a new account.`,
          description: message,
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{t`Create a new account`}</h2>
        <h6>
          <span className="opacity-75">{t`Already have an account?`}</span>
          <Button asChild variant="link" className="px-1.5">
            <Link to="/auth/login">
              {t`Sign in now`} <ArrowRight className="ml-1" />
            </Link>
          </Button>
        </h6>
      </div>

      <div>
        <Form {...form}>
          <form
            ref={formRef}
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Name`}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t({
                        message: "John Doe",
                        context:
                          "Localized version of a placeholder name. For example, Max Mustermann in German or Jan Kowalski in Polish.",
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Username`}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t({
                        message: "john.doe",
                        context:
                          "Localized version of a placeholder username. For example, max.mustermann in German or jan.kowalski in Polish.",
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Email`}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t({
                        message: "john.doe@example.com",
                        context:
                          "Localized version of a placeholder email. For example, max.mustermann@example.de in German or jan.kowalski@example.pl in Polish.",
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Password`}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    <Trans>
                      Hold <code className="text-xs font-bold">Ctrl</code> to display your password
                      temporarily.
                    </Trans>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className="mt-4 w-full">
              {t`Sign up`}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};