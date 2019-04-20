(defmodule MAIN (export ?ALL))

; *************************
; Init rules engine
; *************************
(defrule MAIN::start
  (declare (salience 10000))
  =>
	(focus FINDCC PRINTCC)
)

; *************************
; Find petrol brand based on creditcard 
; *************************
(defmodule FINDCC (import MAIN ?ALL) (export ?ALL))

(defrule FINDCC::bankcard
	(declare (salience 100))
	(form-input (Bankcard ?val))
  =>
    (switch ?val
		(case AMEX-Krisflyer then (assert (card-discount( Bankcard AMEX-Krisflyer )( Brand SPC )( Discount 0.15 ))))
		(case AMEX-Krisflyer-Ascend then (assert (card-discount( Bankcard AMEX-Krisflyer-Ascend )( Brand SPC )( Discount 0.15 ))))
		(case AMEX-Krisflyer-Capitacard then (assert (card-discount( Bankcard AMEX-Krisflyer-Capitacard )( Brand SPC )( Discount 0.15 ))))
		(case Citibank-Cashback then (assert (card-discount( Bankcard Citibank-Cashback )( Brand Shell )( Discount 0.14 ))))
		(case Citibank-Rewards then (assert (card-discount( Bankcard Citibank-Rewards )( Brand Shell )( Discount 0.14 ))))
		(case Citibank-SMRT then (assert (card-discount( Bankcard Citibank-SMRT )( Brand Shell )( Discount 0.14 ))))
		(case DBS-Esso then (assert (card-discount( Bankcard DBS-Esso )( Brand Esso )( Discount 0.212 ))))
		(case HSBC-Advance then (assert (card-discount( Bankcard HSBC-Advance )( Brand Shell )( Discount 0.16 ))))
		(case HSBC-Revolution then (assert (card-discount( Bankcard HSBC-Revolution )( Brand Shell )( Discount 0.16 ))))
		(case HSBC-Visa-Infinite then (assert (card-discount( Bankcard HSBC-Visa-Infinite )( Brand Shell )( Discount 0.16 ))))
		(case HSBC-Visa-Platinium then (assert (card-discount( Bankcard HSBC-Visa-Platinium )( Brand Shell )( Discount 0.16 ))))
		(case Maybank-Family-and-Friends then (assert (card-discount( Bankcard Maybank-Family-and-Friends )( Brand Shell )( Discount 0.08 ))))
		(case Maybank-World-Mastercard then (assert (card-discount( Bankcard Maybank-World-Mastercard )( Brand Shell )( Discount 0.191 ))))
		(case OCBC-365 then (assert (card-discount( Bankcard OCBC-365 )( Brand Caltex )( Discount 0.16 ))))
		(case OCBC-Cashflo then (assert (card-discount( Bankcard OCBC-Cashflo )( Brand Caltex )( Discount 0.16 ))))
		(case OCBC-Plus! then (assert (card-discount( Bankcard OCBC-Plus! )( Brand Esso )( Discount 0.206 ))))
		(case OCBC-Titanium-Rewards then (assert (card-discount( Bankcard OCBC-Titanium-Rewards )( Brand Caltex )( Discount 0.16 ))))
		(case POSB-Everday then (assert (card-discount( Bankcard POSB-Everday )( Brand SPC )( Discount 0.201 ))))
		(case Standard-Chartered-Platinium-Visa-Mastercard then (assert (card-discount( Bankcard Standard-Chartered-Platinium-Visa-Mastercard )( Brand Caltex )( Discount 0.1978 ))))
		(case Standard-Chartered-Spree then (assert (card-discount( Bankcard Standard-Chartered-Spree )( Brand Caltex )( Discount 0.1978 ))))
		(case Standard-Chartered-Unlimited-Cashback then (assert (card-discount( Bankcard Standard-Chartered-Unlimited-Cashback )( Brand Caltex )( Discount 0.2104 ))))
		(case Standard-Chartered-Visa-Infinite then (assert (card-discount( Bankcard Standard-Chartered-Visa-Infinite )( Brand Caltex )( Discount 0.2507 ))))
		(case UOB-One then (assert (card-discount( Bankcard UOB-One )( Brand SPC )( Discount 0.15 ))))
		(case UOB-Preferred-Platinium then (assert (card-discount( Bankcard UOB-Preferred-Platinium )( Brand SPC )( Discount 0.15 ))))
		(case UOB-YOLO then (assert (card-discount( Bankcard UOB-YOLO )( Brand SPC )( Discount 0.15 ))))

    )
)

; *************************
; print result
; *************************
(defmodule PRINTCC (import MAIN ?ALL) (export ?ALL))

(defrule PRINTCC::print-result
	(declare (salience 1))
	(card-discount(Bankcard ?bankcard)(Brand ?brand)(Discount ?discount))
	=>
	(printout t ?brand))

