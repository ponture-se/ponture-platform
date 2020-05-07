import separateNumberByChar from "utils/separateNumberByChar";
import { isPhone } from "utils/responsiveSizes";
const FieldTypes = {
  currency: "CURRENCY",
};
const Stages = {
  accepted: "Offer Accepted",
};
export const Tags = {
  cheapest: "cheapest",
  biggest: "biggest",
  both: "cheapest,biggest",
};
export const BothTagsId = "sameAction";
// ============================================================
export const getCategorizedOffers = (offers) => {
  if (!offers || offers.length === 0) return [];
  const isAcceptedOffer = checkIsAcceptedOffer(offers);
  let offersList = [
    {
      title: !isAcceptedOffer
        ? "OFFERS_CATEGORY_TITLE"
        : "OFFERS_CATEGORY_IS_ACCEPTED_TITLE",
      offers: [],
    },
    {
      title: "OFFERS_CATEGORY_TITLE_CHECK_CREDIT",
      offers: [],
    },
  ];

  function addToList(offer) {
    const isCheckCredit =
      offer.Product_Master_Name &&
      offer.Product_Master_Name.toLowerCase().includes("checkkredit");
    if (!isCheckCredit) offersList[0].offers.push(offer);
    else offersList[1].offers.push(offer);
    // function checkInList(offer) {
    //   if (offersList.length === 0) return false;
    //   else {
    //     for (let i = 0; i < offersList.length; i++) {
    //       const category = offersList[i];
    //       if (offer.title === category.title) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // }
    // const isInList = checkInList(offer);
    // if (!isInList) {
    //   offersList.push({
    //     title: offer.title,
    //     offers: [offer],
    //   });
    // } else {
    //   for (let i = 0; i < offersList.length; i++) {
    //     const category = offersList[i];
    //     if (offer.title === category.title) {
    //       category.offers.push(offer);
    //     }
    //   }
    // }
  }
  function checkOfferTag(offer) {
    if (!offer.tag) return offer;
    else {
      let isCheapest = false,
        cheapestFakeId = Tags.cheapest,
        isBiggest: false,
        biggestFakeId = Tags.biggest;

      if (offer.tag.includes(Tags.cheapest)) {
        isCheapest = true;
        offer.isCheapest = true;
        offer.fakeId = cheapestFakeId;
      } else offer.fakeId = offer.Id;

      if (offer.tag.includes(Tags.biggest)) {
        isBiggest = true;
        offer.isBiggest = true;
        offer.fakeId = biggestFakeId;
      } else {
        if (!offer.fakeId) offer.fakeId = offer.Id;
      }

      // set properties
      if (isCheapest && isBiggest) offer.fakeId = BothTagsId;
    }
    return offer;
  }
  function checkOutlineValues(offer) {
    function getOfferValueByType(outline, offer) {
      let value = outline.isShared
        ? offer[outline.apiName]
        : (offer.detail && offer.detail[outline.apiName]) ||
          outline.defaultValue;
      if (value) {
        const unit = outline.customerUnit
          ? " " + outline.customerUnit + " "
          : "";
        if (outline.type === FieldTypes.currency) {
          const convertedCurrency = separateNumberByChar(value);
          return convertedCurrency + unit;
        } else {
          return value + unit;
        }
      }
      return value;
    }

    const { outline } = offer;
    offer.inListProps = [];
    offer.inDetailProps = [];
    if (!outline || outline.length === 0) return offer;
    const phoneMode = isPhone();
    for (let i = 0; i < outline.length; i++) {
      const item = outline[i];
      let obj = {};
      obj["key"] = item["label"];
      obj["value"] = getOfferValueByType(item, offer);
      if (phoneMode) {
        if (offer.inListProps.length < 3) {
          if (item.showInList === true) offer.inListProps.push(obj);
          else offer.inDetailProps.push(obj);
        } else {
          offer.inDetailProps.push(obj);
        }
      } else {
        if (offer.inListProps.length < 5) {
          if (item.showInList === true) offer.inListProps.push(obj);
          else offer.inDetailProps.push(obj);
        } else {
          offer.inDetailProps.push(obj);
        }
      }
    }

    if (offer.inListProps.length === 0) {
      const count = isPhone() ? 3 : 5;
      if (offer.inDetailProps.length > count) {
        offer.inListProps = offer.inDetailProps.slice(0, count);
        offer.inDetailProps = offer.inDetailProps.slice(
          count,
          offer.inDetailProps.length
        );
      } else {
        offer.inListProps = offer.inDetailProps;
        offer.inDetailProps = [];
      }
    }
    return offer;
  }
  for (let i = 0; i < offers.length; i++) {
    const offer = offers[i];

    const checkedTagOffer = checkOfferTag(offer);
    const checkedOutlineValues = checkOutlineValues(checkedTagOffer);
    if (!isAcceptedOffer || isAcceptedOffer.Id !== offer.Id)
      addToList(checkedOutlineValues);
  }
  return offersList;
};
export const checkIsAcceptedOffer = (offers) => {
  const item = offers.find((item) => item.Stage === Stages.accepted);
  if (item) return item;

  return false;
};
export const checkIsSameUiAction = (offers) => {
  if (offers && offers.length > 0) {
    const item = offers.find((offer) => {
      if (
        offer.tag &&
        offer.tag.includes(Tags.cheapest) &&
        offer.tag.includes(Tags.biggest)
      ) {
        return true;
      }
      return false;
    });
    if (item) return true;
    return false;
  }
  return false;
};
