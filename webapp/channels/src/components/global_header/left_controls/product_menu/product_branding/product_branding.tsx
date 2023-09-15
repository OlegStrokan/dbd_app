// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from "react";
import styled from "styled-components";

import Heading from "@mattermost/compass-components/components/heading"; // eslint-disable-line no-restricted-imports

import { useCurrentProduct } from "utils/products";

const ProductBrandingContainer = styled.div`
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }
`;

const ProductBranding = (): JSX.Element => {
  const currentProduct = useCurrentProduct();

  return (
    <ProductBrandingContainer tabIndex={0}>
      <img
        width={18}
        alt="dpd logo"
        src="https://www.dpd.com/wp-content/uploads/sites/226/2020/05/DPD_symbol_black_rgb.png"
      />
      <Heading element="h1" size={200} margin="none">
        {currentProduct ? currentProduct.switcherText : "DPD"}
      </Heading>
    </ProductBrandingContainer>
  );
};

export default ProductBranding;
