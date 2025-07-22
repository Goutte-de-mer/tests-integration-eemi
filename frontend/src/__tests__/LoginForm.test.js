import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";
import { loginAction } from "@/lib/actions";

jest.mock("../lib/actions", () => ({
  loginAction: jest.fn(),
}));

describe("LoginForm - Tests Unitaires", () => {
  const mockSetSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche les champs email et password", () => {
    render(<LoginForm setSuccess={mockSetSuccess} />);

    expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /se connecter/i })
    ).toBeInTheDocument();
  });

  test("permet de saisir dans les champs", async () => {
    const user = userEvent.setup();
    render(<LoginForm setSuccess={mockSetSuccess} />);

    const emailInput = screen.getByLabelText(/adresse email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("réagit au clic du bouton submit", async () => {
    const user = userEvent.setup();
    loginAction.mockResolvedValue({ success: true });
    render(<LoginForm setSuccess={mockSetSuccess} />);

    await user.type(
      screen.getByLabelText(/adresse email/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/mot de passe/i), "password123");

    const submitButton = screen.getByRole("button", { name: /se connecter/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetSuccess).toHaveBeenCalledTimes(1);
    });
  });
});

describe("LoginForm - Tests d'Intégration", () => {
  const mockSetSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("soumet les données saisies à la fonction login", async () => {
    const user = userEvent.setup();
    loginAction.mockResolvedValue({ success: true });
    render(<LoginForm setSuccess={mockSetSuccess} />);

    await user.type(
      screen.getByLabelText(/adresse email/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/mot de passe/i), "TestPassword123!");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith(expect.any(FormData));
      expect(mockSetSuccess).toHaveBeenCalled();
    });
  });

  test("affiche message d'erreur si login échoue", async () => {
    const user = userEvent.setup();
    loginAction.mockResolvedValue({ error: "Email inconnu" });
    render(<LoginForm setSuccess={mockSetSuccess} />);

    await user.type(screen.getByLabelText(/adresse email/i), "wrong@test.com");
    await user.type(screen.getByLabelText(/mot de passe/i), "password");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inconnu/i)).toBeInTheDocument();
    });
  });

  test("affiche message d'erreur si mot de passe incorrect", async () => {
    const user = userEvent.setup();
    loginAction.mockResolvedValue({ error: "Mot de passe incorrect" });
    render(<LoginForm setSuccess={mockSetSuccess} />);

    await user.type(
      screen.getByLabelText(/adresse email/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/mot de passe/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/mot de passe incorrect/i)).toBeInTheDocument();
    });
  });
});
