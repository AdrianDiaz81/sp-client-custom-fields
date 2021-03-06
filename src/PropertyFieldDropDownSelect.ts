/**
 * @file PropertyFieldDropDownSelect.ts
 * Define a custom field of type PropertyFieldDropDownSelect for
 * the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  IPropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-client-preview';
import PropertyFieldDropDownSelectHost, { IPropertyFieldDropDownSelectHostProps } from './PropertyFieldDropDownSelectHost';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

/**
 * @interface
 * Public properties of the PropertyFieldDropDownSelect custom field
 *
 */
export interface IPropertyFieldDropDownSelectProps {
  /**
   * @var
   * Property field label displayed on top
   */
  label: string;
  /**
   * @var
   * Initial value
   */
  initialValue?: string[];
  /**
   * @var
   * Dropdown options
   */
  options: IDropdownOption[];
  /**
   * @function
   * Defines a onPropertyChange function to raise when the selected Font changed.
   * Normally this function must be always defined with the 'this.onPropertyChange'
   * method of the web part object.
   */
  onPropertyChange(propertyPath: string, newValue: any): void;
}

/**
 * @interface
 * Private properties of the PropertyFieldDropDownSelect custom field.
 * We separate public & private properties to include onRender & onDispose method waited
 * by the PropertyFieldCustom, witout asking to the developer to add it when he's using
 * the PropertyFieldDropDownSelect.
 *
 */
export interface IPropertyFieldDropDownSelectPropsInternal extends IPropertyPaneCustomFieldProps {
  label: string;
  initialValue?: string[];
  targetProperty: string;
  options: IDropdownOption[];
  onRender(elem: HTMLElement): void;
  onDispose(elem: HTMLElement): void;
  onPropertyChange(propertyPath: string, newValue: any): void;
}

/**
 * @interface
 * Represents a PropertyFieldDropDownSelect object
 *
 */
class PropertyFieldDropDownSelectBuilder implements IPropertyPaneField<IPropertyFieldDropDownSelectPropsInternal> {

  //Properties defined by IPropertyPaneField
  public type: IPropertyPaneFieldType = IPropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldDropDownSelectPropsInternal;

  //Custom properties
  private label: string;
  private initialValue: string[];
  private options: IDropdownOption[];
  private onPropertyChange: (propertyPath: string, newValue: any) => void;

  /**
   * @function
   * Ctor
   */
  public constructor(_targetProperty: string, _properties: IPropertyFieldDropDownSelectPropsInternal) {
    this.targetProperty = _properties.targetProperty;
    this.properties = _properties;
    this.label = _properties.label;
    this.initialValue = _properties.initialValue;
    this.options = _properties.options;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.onPropertyChange = _properties.onPropertyChange;
  }

  /**
   * @function
   * Renders the ColorPicker field content
   */
  private render(elem: HTMLElement): void {
    //Construct the JSX properties
    const element: React.ReactElement<IPropertyFieldDropDownSelectHostProps> = React.createElement(PropertyFieldDropDownSelectHost, {
      label: this.label,
      initialValue: this.initialValue,
      targetProperty: this.targetProperty,
      options: this.options,
      onDispose: this.dispose,
      onRender: this.render,
      onPropertyChange: this.onPropertyChange
    });
    //Calls the REACT content generator
    ReactDom.render(element, elem);
  }

  /**
   * @function
   * Disposes the current object
   */
  private dispose(elem: HTMLElement): void {

  }

}

/**
 * @function
 * Helper method to create a Font Picker on the PropertyPane.
 * @param targetProperty - Target property the Font picker is associated to.
 * @param properties - Strongly typed Font Picker properties.
 */
export function PropertyFieldDropDownSelect(targetProperty: string, properties: IPropertyFieldDropDownSelectProps): IPropertyPaneField<IPropertyFieldDropDownSelectPropsInternal> {

    //Create an internal properties object from the given properties
    var newProperties: IPropertyFieldDropDownSelectPropsInternal = {
      label: properties.label,
      targetProperty: targetProperty,
      initialValue: properties.initialValue,
      options: properties.options,
      onPropertyChange: properties.onPropertyChange,
      onDispose: null,
      onRender: null
    };
    //Calles the PropertyFieldDropDownSelect builder object
    //This object will simulate a PropertyFieldCustom to manage his rendering process
    return new PropertyFieldDropDownSelectBuilder(targetProperty, newProperties);
}


