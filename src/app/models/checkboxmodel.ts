export class CheckBoxModel{
    public value?:number;
    public viewValue:string;
    public checked: boolean;
    constructor(viewValue:string, checked: boolean, value?:number ){
      this.viewValue = viewValue;
      this.checked = checked;
      this.value = value;
    }
  }