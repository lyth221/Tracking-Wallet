import React from "react";
import '../common/scss/components/RadioButton.scss';


export default class RadioButton extends React.Component {
    constructor(props) {
        super(props);
    }
    handleChange(e) {
        this.props.onChange(e);
    }
    render() {
        const uuid = parseInt(Math.random() * 99999);
        const { name, labelText, customClass, value } = this.props;
        return (
            <div className={"radio-button " + customClass} >
                <input type="radio" name={name} id={'radio-' + uuid} value={value}
                    onChange={this.handleChange.bind(this)}
                />
                <label htmlFor={'radio-' + uuid}><span>{labelText}</span></label>
            </div>
        )
    }
}