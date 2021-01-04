function accessStorage(action: any) {
  try {
    return action;
  } catch (e) {
    return e instanceof DOMException && (
    // everything except Firefox
      e.code === 22
            // Firefox
            || e.code === 1014
            // test name field too, because code might not be present
            // everything except Firefox
            || e.name === 'QuotaExceededError'
            // Firefox
            || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
            // acknowledge QuotaExceededError only if there's something already stored
            && (localStorage && localStorage.length !== 0);
  }
}

const setItem = (key: string, value: any) : void => accessStorage(localStorage.setItem(key, value));
const getItem = (key: string) : any => accessStorage(localStorage.getItem(key));
const removeItem = (key: string) : void => accessStorage(localStorage.removeItem(key));

export { setItem, getItem, removeItem };
