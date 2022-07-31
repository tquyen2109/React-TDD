import SignUpPage from "./SignUpPage";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";
describe("Sign Up Page", () => {
    describe("Layout", () => {
        it("has header", () => {
            render(<SignUpPage />);
            const header = screen.queryByRole("heading",{ name: "Sign Up"});
            expect(header).toBeInTheDocument();
        });
        it("has username input", () => {
            render(<SignUpPage />);
            const input = screen.getByLabelText("Username");
            expect(input).toBeInTheDocument();
        });
        it("has email input", () => {
            render(<SignUpPage />);
            const input = screen.getByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });
        it("has password input", () => {
            render(<SignUpPage />);
            const input = screen.getByLabelText("Password");
            expect(input).toBeInTheDocument();
        });
        it("has password type for password input", () => {
            render(<SignUpPage />);
            const input = screen.getByLabelText("Password");
            expect(input.type).toBe("password");
        });
        it("has password repeat input", () => {
            render(<SignUpPage />);
            const input = screen.getByLabelText("Password Repeat");
            expect(input).toBeInTheDocument();
        });
        it("has password type for password repeat input", () => {
            render(<SignUpPage />);
            const input = screen.getByLabelText("Password Repeat");
            expect(input.type).toBe("password");
        });
        it("has sign up button", () => {
            render(<SignUpPage />);
            const button = screen.queryByRole("button",{ name: "Sign Up"});
            expect(button).toBeInTheDocument();
        });
        it("disable the button initially", () => {
            render(<SignUpPage />);
            const button = screen.queryByRole("button",{ name: "Sign Up"});
            expect(button).toBeDisabled();
        });
    });
    describe("Interactions", () => {
        it('should enables the button when password and password repeat fields have same value', function () {
            render(<SignUpPage />);
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            userEvent.type(passwordInput, "Password");
            userEvent.type(passwordRepeatInput, "Password");
            const button = screen.queryByRole("button",{ name: "Sign Up"});
            expect(button).toBeEnabled();
        });
        it('should send username and password to backend after clicking the button', async function () {
            let requestBody;
            const server = setupServer(
              rest.post('/api/1.0/users', (req, res, context) => {
                  requestBody = req.body
                  return res(context.status(200))
              })
            );
            server.listen();
            render(<SignUpPage />);
            const usernameInput = screen.getByLabelText("Username");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            userEvent.type(usernameInput, 'user1');
            userEvent.type(emailInput, 'user1@mail.com');
            userEvent.type(passwordInput, "Password");
            userEvent.type(passwordRepeatInput, "Password");
            const button = screen.queryByRole("button",{ name: "Sign Up"});
            userEvent.click(button);
            await new Promise((resolve) => setTimeout(resolve,1000));
            expect(requestBody).toEqual({
                username: 'user1',
                email: 'user1@mail.com',
                password: 'Password'
            })
        });
    });
});
