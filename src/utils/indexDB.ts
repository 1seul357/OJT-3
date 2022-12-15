export const indexDB = (key: string, value: object) => {
  const request = window.indexedDB.open("IndexDB");
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(["name"], "readwrite");

    const objStore = transaction.objectStore("name");
    let items = { id: "name", value: value };
    const objStoreRequest = objStore.get("name");

    objStoreRequest.onsuccess = () => {
      if (key === "items") {
        items.id = objStoreRequest.result.value;
        objStore.put(items);
      } else {
        objStore.add(items);
      }
    };
    objStoreRequest.onerror = () => {
      alert("데이터 저장에 실패했습니다.");
    };
  };
};
