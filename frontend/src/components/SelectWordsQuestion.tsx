interface SelectWordsFromChoiceProps {
    sentence: string;
    selectedIndices: number[];
    onToggleWord: (index: number) => void;
}

const SelectWordsFromChoice: React.FC<SelectWordsFromChoiceProps> = ({ 
    sentence,
    selectedIndices,
    onToggleWord 
}) => {
    const words = sentence.split(' ').map((word, index) => ({
        word,
        index
    }));

    return (
        <div>
            <div style={{ cursor: 'pointer' }}>
                {words.map(({ word, index }) => (
                    <span key={index}  onClick={() => onToggleWord(index)} style={{
                        outline: selectedIndices.includes(index) ? '1px solid blue' : 'none',
                        margin: '0 4px'
                    }}>
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SelectWordsFromChoice;