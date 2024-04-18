export interface Product {
  /**
   * @example "980768ff-bfeb-473e-83a4-86ada4102c03"
   */
  id: string;
  /**
   * @example "iPhone 12"
   */
  name: string;
  /**
   * @example "brand new"
   */
  description: string;
  /**
   * @example 1999.99
   * @minimum 0 price has to be equal or greater than 0
   */
  price: number;
  /**
   * @example "2022-12-13T18:58:59.044Z"
   */
  createdAt: Date;
}
