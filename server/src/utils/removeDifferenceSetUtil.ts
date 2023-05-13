const removeDifferenceFromSet = (originalSet: Set<string>, toBeRemovedSet: Set<string>) => {
  [...toBeRemovedSet].forEach(function (v) {
    originalSet.delete(v);
  });
};

export default removeDifferenceFromSet;
