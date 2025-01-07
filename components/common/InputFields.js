'use client'
import {Field} from "formik";
import { capitalizeFirstChar } from "../../components/common/Functions";
export function InputTextFields({ name, id, label, required }) {
    return (
        <fieldset className="box box-fieldset">
            <label tmlFor={id}>{label}{required?<span>*</span>:null}</label>
            <Field type="text" id={id} name={name} className="form-control style-1" />
        </fieldset>
    );
}

export function InputNumberFields({ name, id, label, required, onChange }) {
    return (
        <fieldset className="box box-fieldset">
            <label htmlFor={id}>{label}{required?<span>*</span>:null}</label>
            <Field type="number" id={id} name={name} onChange={onChange} className="form-control style-1" min="0" />
        </fieldset>
    );
}

export function InputTextAreaFields({ name, id, label, required }) {
    return (
        <fieldset className="box-fieldset">
            <label tmlFor={id}>{label}{required?<span>*</span>:null}</label>
            <Field type="textarea"  as="textarea"  id={id} name={name} className="textarea-tinymce" />
        </fieldset>
    );
}

export const SelectOptionFields = ({ name, label, required, onChange, optionText, options }) => {
    return (
        <fieldset className="box box-fieldset">
            <label htmlFor={name}>
                {label}
                {required ? <span>*</span> : null}
            </label>
            <Field
                as="select"
                name={name}
                className="nice-select country-code"
                onChange={onChange}
            >
                <option value="">{optionText}</option>
                {options && Array.isArray(options) && options.length > 0
                    ? options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {capitalizeFirstChar(option.name || option.title)}
                        </option>
                    ))
                    : null}
            </Field>
        </fieldset>
    );
};

export function InputPriceFields({ name, label, required, value, onChange, optionText, options, priceFieldName, priceFieldId }) {
    return (
        <fieldset className="box-fieldset ">
            <label htmlFor={name}> {label} {required ? <span>*</span> : null} </label>
                <div className="phone-and-country-code">
                    <Field as="select" name={name} className="nice-select country-code"
                        id="country-code"
                        value={value}
                        onChange={onChange}
                    >
                        <option value="">{optionText}</option>
                            {options && Array.isArray(options) && options.length > 0 ? options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {capitalizeFirstChar(option.name || option.title)}
                                </option>
                            ))
                        : null}
                    </Field>
                    <Field type="text" id={priceFieldId} name={priceFieldName} className="form-control style-1" />
                </div>
        </fieldset>
    );
}
