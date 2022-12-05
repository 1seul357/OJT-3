import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const onClickState = atom({
  key: "onClickState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
