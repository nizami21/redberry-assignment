export const formatPrice = (price, comma = false) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, comma ? ", " : " ");
};
  