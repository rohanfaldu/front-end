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