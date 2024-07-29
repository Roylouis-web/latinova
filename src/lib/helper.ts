import { ref } from "vue";

const hash = ref("");
const cartItemsCount = ref(0);
const orderCount = ref(0);
const payload = ref<Client>({} as Client);
const passwordVisibility = ref(false);
const newPasswordVisibility = ref(false);
const retypedPasswordVisibility = ref(false);
const registerPasswordisibility = ref(false);

const toggleHamburgerMenu = () => {
  const hamburgerMenu = document.getElementById("hamburgerMenu") as HTMLElement;
  hamburgerMenu?.classList.toggle("toggle");

  const sideBar = document.getElementById("sideBar") as HTMLElement;
  sideBar?.classList.toggle("scale-0");
  sideBar?.classList.toggle("duration-1000");
};

const togglePassword = (id: string) => {
  const password = document.getElementById(id) as HTMLInputElement;

  if (password.type === "password") {
    password.type = "text";
    switch (id) {
      case "password":
        passwordVisibility.value = true;
        break;
      case "newPassword":
        newPasswordVisibility.value = true;
        break;
      case "registerPassword":
        registerPasswordisibility.value = true;
        break;
      default:
        retypedPasswordVisibility.value = true;
    }
  } else {
    password.type = "password";
    switch (id) {
      case "password":
        passwordVisibility.value = false;
        break;
      case "newPassword":
        newPasswordVisibility.value = false;
        break;
      case "registerPassword":
        registerPasswordisibility.value = false;
        break;
      default:
        retypedPasswordVisibility.value = false;
    }
  }
};

export {
  toggleHamburgerMenu,
  togglePassword,
  hash,
  payload,
  cartItemsCount,
  orderCount,
  passwordVisibility,
  newPasswordVisibility,
  retypedPasswordVisibility,
  registerPasswordisibility,
};
