class UserCard extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init(){
      this.templateElem = document.getElementById('userCardTemplate');
      this.shadow = this.attachShadow( { mode: 'closed' } );
      this.content = this.templateElem.content.cloneNode(true);
    }

    //  当 custom element首次被插入文档DOM时，被调用。
    connectedCallback() {
      console.log("connectedCallback.");
      this.render();
    }
    // 当 custom element从文档DOM中删除时，被调用。
    disconnectedCallback() {
      console.log("disconnectedCallback.");
    }
    // 当 custom element被移动到新的文档时，被调用。
    adoptedCallback(){
      console.log("adoptedCallback.");
    }

    // 当 custom element增加、删除、修改自身属性时，被调用。
    attributeChangedCallback(name, oldValue, newValue) {
      console.log("attributeChangedCallback. change " + name + "value is" + newValue + "old Value is" + oldValue);
    }

    render(){
      this.shadow .appendChild(this.templateElem.cloneNode(true));
      this.shadow.appendChild(this.content);
    }
  }

window.customElements.define('user-card', UserCard);
