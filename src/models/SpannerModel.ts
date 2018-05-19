import spanner from '../config/spanner';

/**
 * SpannerModel Class.
 */
class SpannerModel {
  public static tableName: string;
  private instance: any;

  constructor() {
    this.createInstance();
  }

  query(raw: object) {
    return this.instance.run(raw);
  }

  /**
   * Insert data.
   *
   * @param {object | any[]} data
   */
  insert(data: object | any[]) {
    return this.instance.insert(data);
  }

  /**
   * Create spanner table instance.
   *
   * @private
   * @memberof SpannerModel
   */
  private createInstance() {
    this.instance = spanner.table('Singers');
  }
}

export default SpannerModel;
