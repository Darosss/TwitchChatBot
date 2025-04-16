import ModalDataWrapper from "@components/modalDataWrapper";

import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setPrefixChance,
  setPrefixes,
  setSuffixChance,
  setSuffixes,
} from "@redux/affixesSlice";
import { RootStore } from "@redux/store";

export default function AffixModalData() {
  const dispatch = useDispatch();
  const affixState = useSelector((state: RootStore) => state.affixes.affix);
  const { name, prefixChance, suffixChance, suffixes, prefixes } = affixState;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            dispatch(setName(e.currentTarget.value));
          }}
        />
      </div>
      <div>PrefixChance</div>
      <div>
        <input
          type="number"
          value={prefixChance}
          min={0}
          max={100}
          onChange={(e) => {
            const valueAsNumber = e.target.valueAsNumber;
            dispatch(setPrefixChance(isNaN(valueAsNumber) ? 0 : valueAsNumber));
          }}
        />
      </div>
      <div>Prefixes</div>
      <div>
        <textarea
          value={prefixes.join("\n")}
          onChange={(e) => {
            dispatch(setPrefixes(e.target.value.split("\n")));
          }}
        />
      </div>
      <div>SuffixChance</div>
      <div>
        <input
          type="number"
          value={suffixChance}
          min={0}
          max={100}
          onChange={(e) => {
            const valueAsNumber = e.target.valueAsNumber;
            dispatch(setSuffixChance(isNaN(valueAsNumber) ? 0 : valueAsNumber));
          }}
        />
      </div>

      <div>Suffixes</div>
      <div>
        <textarea
          value={suffixes.join("\n")}
          onChange={(e) => {
            dispatch(setSuffixes(e.target.value.split("\n")));
          }}
        />
      </div>
    </ModalDataWrapper>
  );
}
