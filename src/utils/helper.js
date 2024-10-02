export const validateEmail = (email) =>{
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);

};

export const getInitials = (name) =>{
    if(!name)
        return "";
    const words = name.split(" ");
    let initials = "";
    for(let i=0;i<Math.min(words.length,2);i++)
    {
        initials += words[i][0];
    }
    return initials;
}

export const getEmptyCardMessage = (filterType) => {
    switch(filterType){
        case "search":
            return 'No stories found matching your search';
        case "date":
            return 'No stories found in this given date range';
        default:
            return '';
    }
}