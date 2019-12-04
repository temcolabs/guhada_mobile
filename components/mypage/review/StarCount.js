export default function StarCount(item) {
  let rating;

  switch (item) {
    case 'HALF':
      rating = 0.5;
      break;
    case 'ONE':
      rating = 1;
      break;
    case 'ONE_HALF':
      rating = 1.5;
      break;
    case 'TWO':
      rating = 2;
      break;
    case 'TWO_HALF':
      rating = 2.5;
      break;
    case 'THREE':
      rating = 3;
      break;
    case 'THREE_HALF':
      rating = 3.5;
      break;
    case 'FOUR':
      rating = 4;
      break;
    case 'FOUR_HALF':
      rating = 4.5;
      break;
    case 'FIVE':
      rating = 5;
      break;
  }

  return rating;
}
