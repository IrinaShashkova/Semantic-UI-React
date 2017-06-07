import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
} from '../../lib'

/**
 * A TextArea can be used to allow for extended user input.
 * @see Form
 */
class TextArea extends Component {
  static _meta = {
    name: 'TextArea',
    type: META.TYPES.ADDON,
  }

  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** Indicates whether height of the textarea fits the content or not. */
    autoHeight: PropTypes.bool,

    /**
     * Called on change.
     * @param {SyntheticEvent} event - The React SyntheticEvent object
     * @param {object} data - All props and the event value.
     */
    onChange: PropTypes.func,

    /** Indicates row count for a TextArea. */
    rows: PropTypes.number,

    /** Custom TextArea style. */
    style: PropTypes.object,

    /** The value of the textarea. */
    value: PropTypes.string,
  }

  static defaultProps = {
    as: 'textarea',
    rows: 3,
  }

  componentDidMount() {
    this.updateHeight()
  }

  componentDidUpdate(prevProps, prevState) {
    // removed autoHeight
    if (!this.props.autoHeight && prevProps.autoHeight) {
      this.removeAutoHeightStyles()
    }
    // added autoHeight or value changed
    if (this.props.autoHeight && !prevProps.autoHeight || prevProps.value !== this.props.value) {
      this.updateHeight()
    }
  }

  focus = () => (this.ref.focus())

  handleChange = e => {
    const value = _.get(e, 'target.value')

    _.invoke(this.props, 'onChange', e, { ...this.props, value })
    this.updateHeight()
  }

  handleRef = c => (this.ref = c)

  removeAutoHeightStyles = () => {
    this.ref.style.height = null
    this.ref.style.resize = null
  }

  updateHeight = () => {
    const { autoHeight } = this.props
    if (!this.ref || !autoHeight) return

    let { borderTopWidth, borderBottomWidth } = window.getComputedStyle(this.ref)
    borderTopWidth = parseInt(borderTopWidth, 10)
    borderBottomWidth = parseInt(borderBottomWidth, 10)

    this.ref.style.resize = 'none'
    this.ref.style.height = 'auto'
    this.ref.style.height = (this.ref.scrollHeight + borderTopWidth + borderBottomWidth) + 'px'
  }

  render() {
    const { rows, style, value } = this.props
    const minHeight = _.get(style, 'minHeight', 0)

    const rest = getUnhandledProps(TextArea, this.props)
    const ElementType = getElementType(TextArea, this.props)

    return (
      <ElementType
        {...rest}
        onChange={this.handleChange}
        ref={this.handleRef}
        rows={rows}
        style={{ ...style, minHeight }}
        value={value}
      />
    )
  }
}

export default TextArea
