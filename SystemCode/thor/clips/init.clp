(deftemplate card-discount
  	(slot Bankcard)
  	(slot Brand (allowed-symbols Shell Esso SPC Caltex))
  	(slot Discount(type FLOAT)(default 0.0)) 
	(slot filter-checked (allowed-symbols TRUE FALSE)(default FALSE))
)


(deftemplate form-input
  	(slot Bankcard)
)

;; -- to remove this section when call from python

;(deffacts form-inputs
;  (form-input
;    (Bankcard AMEX-Krisflyer)
;  )
;)
