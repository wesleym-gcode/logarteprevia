/** Base dos componentes gerados: guarda estado e avisa o runtime para redesenhar. */
export class DCLogic {
  props: Record<string, any>;
  state: Record<string, any> = {};
  _notify: (() => void) | null = null;
  constructor(props?: Record<string, any>) {
    this.props = props || {};
  }
  setState(patch: any) {
    const p = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, p);
    this._notify?.();
  }
}
