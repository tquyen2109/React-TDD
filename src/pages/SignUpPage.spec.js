import SignUpPage from "./SignUpPage";
import {render, screen, waitFor} from "@testing-library/react";
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
        let button;
        let requestBody;
        let counter = 0;
        const server = setupServer(
            rest.post('/api/1.0/users', (req, res, context) => {
                requestBody = req.body;
                counter += 1;
                return res(context.status(200))
            })
        );
        beforeEach(() => {
            counter = 0
        });
        beforeEach(() =>  server.listen());
        afterEach(() =>  server.close());
        const setup = () => {
            render(<SignUpPage />);
            const usernameInput = screen.getByLabelText("Username");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            userEvent.type(usernameInput, 'user1');
            userEvent.type(emailInput, 'user1@mail.com');
            userEvent.type(passwordInput, "Password");
            userEvent.type(passwordRepeatInput, "Password");
            button = screen.queryByRole("button",{ name: "Sign Up"});
        };
        it('should enables the button when password and password repeat fields have same value', function () {
            setup();
            expect(button).toBeEnabled();
        });
        it('should send username and password to backend after clicking the button', async function () {
            setup();
            userEvent.click(button);
            await screen.findByText('Please check you email to activate your account');
            expect(requestBody).toEqual({
                username: 'user1',
                email: 'user1@mail.com',
                password: 'Password'
            });
            expect(counter).toBe(1);
            server.close();
        });
        it('should disable button when there is ongoing api', async function () {
            setup();
            userEvent.click(button);
            userEvent.click(button);
            await screen.findByText('Please check you email to activate your account');
            expect(counter).toBe(1);
        });
        it('display spinner after clicking the submit', async function () {
            setup();
            expect(screen.queryByRole('status', {hidden: true})).not.toBeInTheDocument();
            userEvent.click(button);
            const spinner = screen.getByRole('status', {hidden: true});
            expect(spinner).toBeInTheDocument();
            await screen.findByText('Please check you email to activate your account');
        });
        it('display account activation notification after successful sign up request',async function () {
            setup();
            const message = 'Please check you email to activate your account';
            expect(screen.queryByText(message)).not.toBeInTheDocument();
            userEvent.click(button);
            const text = await screen.findByText("Please check you email to activate your account");
            expect(text).toBeInTheDocument();
        });
        it('should hide sign up form after successful sign up request',async function () {
            setup();
            const form = screen.getByTestId("form-sign-up");
            userEvent.click(button);
            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            });
        });
    });
});
