export function capitalizeFirstChar(str) {
    if (!str) return str; // Check for empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function userType(type) {
    const UserType = {
        GOOGLE: "GOOGLE",
        FACEBOOK: "FACEBOOK",
        NONE: "NONE"
    };
    
    return UserType[type] ? UserType[type] : UserType.NONE;
}

export function split(string, key) {
    const response = string.trim().split(/\s+/); 
    
    return response[key];
}

export  function validateYouTubeURL(inputURL) {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}$/;
    if(regex.test(inputURL)) {
        // console.log(1);
      return true;
    } else {
        // console.log(2);
      return false;
    }
};
export function checkURL(url) {
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/[^\s]*)?$/;
  if(pattern.test(url)) {
    return true;
  } else {
      // console.log(2);
    return false;
  }
}

export function formatPropertyPrice(amount){
  const number = parseFloat(amount.toString().replace(/[^\d]/g, ''));
  return new Intl.NumberFormat('fr-FR').format(number);
};

export function navigateTo(router, path) {
  router.push(path);
}

export const DEBUG_MODE = true;

export function debugLog(text, ...args) {
  if (DEBUG_MODE) {
    console.log(text, ...args);
  }
}