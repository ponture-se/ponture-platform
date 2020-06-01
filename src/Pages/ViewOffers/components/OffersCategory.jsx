import React from "react";
import Item from "./OfferItem";
import useGlobalState from "hooks/useGlobalState";
import useLocale from "hooks/useLocale";
import AcceptModal from "./AcceptModal";

const OffersCategory = ({
  opportunity = {},
  category: { title = "", offers = [] },
  isAccepted,
  onEndAccepting,
}) => {
  const [{ offerUiAction }] = useGlobalState();
  const [modal, toggleModal] = React.useState();
  const [selectedOffer, setOffer] = React.useState();
  const { t } = useLocale();

  const refs = offers.reduce((acc, value) => {
    acc[value.fakeId] = React.createRef();
    return acc;
  }, {});

  function useEffectFunc() {
    if (offerUiAction && offerUiAction.isClicked) {
      if (refs[offerUiAction.name] && refs[offerUiAction.name].current) {
        window.scrollTo(0, refs[offerUiAction.name].current.offsetTop - 50);
        // refs[offerUiAction.name].current.scrollIntoView({
        //   behavior: "smooth",
        //   block: "start",
        // });
      }
    }
  }
  React.useEffect(useEffectFunc, [offerUiAction]);
  function handleCloseModal() {
    toggleModal(false);
  }
  function handleAcceptClicked(offer) {
    toggleModal(true);
    setOffer(offer);
  }
  function handleEndedAccepting() {
    if (onEndAccepting) {
      onEndAccepting();
    }
  }
  return (
    <>
      <div className="OffersCategory animated fadeIn">
        <h5 className="row-title">{offers && offers.length ? t(title) : ""}</h5>
        <div className="offersCategory__list">
          {offers.map((offer) => (
            <Item
              key={offer.Id}
              offer={offer}
              ref={refs[offer.fakeId]}
              onAcceptClicked={handleAcceptClicked}
              isAccepted={isAccepted}
              opportunity={opportunity}
            />
          ))}
        </div>
      </div>
      {modal && (
        <AcceptModal
          selectedOffer={selectedOffer}
          opportunity={opportunity}
          onClose={handleCloseModal}
          onEndAccepting={handleEndedAccepting}
        />
      )}
    </>
  );
};
export default OffersCategory;
