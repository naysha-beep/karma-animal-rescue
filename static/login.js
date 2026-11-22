const DEMO_ACCOUNTS = [
{
    email:"staff@karma.org.in",
    password:"Karma@123"
}
];

const loginForm =
document.getElementById(
    "loginForm"
);

const errorMessage =
document.getElementById(
    "errorMessage"
);

const passwordInput =
document.getElementById(
    "password"
);

document
.getElementById(
    "togglePassword"
)
.addEventListener(
    "click",
    () => {

        const isPassword =
        passwordInput.type ===
        "password";

        passwordInput.type =
        isPassword
        ? "text"
        : "password";

        document
        .getElementById(
            "togglePassword"
        )
        .textContent =
        isPassword
        ? "Hide"
        : "Show";
    }
);

loginForm.addEventListener(
    "submit",
    e => {

        e.preventDefault();

        errorMessage.textContent =
        "";

        const email =
        document
        .getElementById(
            "email"
        )
        .value
        .trim()
        .toLowerCase();

        const password =
        passwordInput.value;

        const account =
        DEMO_ACCOUNTS.find(
            user =>
            user.email === email &&
            user.password === password
        );

        if(!account){

            errorMessage.textContent =
            "Invalid Email or Password";

            return;
        }

        sessionStorage.setItem(
            "karmaStaffLoggedIn",
            "true"
        );

        sessionStorage.setItem(
            "karmaStaffEmail",
            email
        );

        window.location.href =
        "/dashboard";
    }
);